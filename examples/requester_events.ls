// Original Workbench exercise for Modeler. Host runtime verification pending.
@version 2.3
@warnings
@script modeler
@name "Requester Events Lab"

sourceField, factorField, previewField;

main
{
    reqbegin("Requester Events Lab");
    sourceField = ctlnumber("Source Length", 2.0);
    factorField = ctlnumber("Factor", 1.0);
    previewField = ctlnumber("Preview Display", 2.0);
    ctlbutton("Preview", 80, "showPreview");
    ctlrefresh(sourceField, "invalidatePreview");
    ctlrefresh(factorField, "invalidatePreview");

    accepted = reqpost();
    if (accepted)
    {
        sourceLength = getvalue(sourceField);
        factor = getvalue(factorField);
    }
    reqend();

    if (!accepted)
        return;
    if (sourceLength <= 0 || factor <= 0)
    {
        warn("Source Length and Factor must be positive.");
        return;
    }

    info("Applied result: ", resultFor(sourceLength, factor));
}

invalidatePreview: value
{
    setvalue(previewField, 0.0);
}

showPreview
{
    sourceLength = getvalue(sourceField);
    factor = getvalue(factorField);
    if (sourceLength <= 0 || factor <= 0)
    {
        setvalue(previewField, 0.0);
        return;
    }

    setvalue(previewField, resultFor(sourceLength, factor));
}

resultFor: sourceLength, factor
{
    return sourceLength * factor;
}
